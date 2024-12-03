"use client"

import React, { useEffect, useState } from "react";
import { auth, db } from "../hooks/firebase";
import { signOut, onAuthStateChanged, User, updateProfile } from "firebase/auth";
import { addDoc, collection, getDocs, query, Timestamp, deleteDoc, doc, where } from "firebase/firestore";
import Footer from "../components/Footer";
import { useRouter } from "next/navigation";
import styles from "./Mypage.module.css";
import { useDisclosure, Spinner, Input, Button, Textarea, Box, Text } from "@chakra-ui/react";
import LoginModal from "../ Login/Login";
import { useToast } from "@chakra-ui/react";

const Mypage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [contactMessage, setContactMessage] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [isContactFormVisible, setIsContactFormVisible] = useState(true);
  const [sentToday, setSentToday] = useState<number>(0); // 今日送ったお問い合わせ数
  const router = useRouter();
  const { onOpen } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setDisplayName(currentUser.displayName || "");
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        if (currentUser.email === adminEmail) {
          setIsAdmin(true);
          fetchContacts();
        } else {
          setIsAdmin(false);
        }
        checkSentMessages();
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const fetchContacts = async () => {
    const contactsRef = collection(db, "contacts");
    const q = query(contactsRef);
    const querySnapshot = await getDocs(q);
    const contactsList: any[] = [];
    querySnapshot.forEach((doc) => {
      contactsList.push({ id: doc.id, ...doc.data() });
    });
    setContacts(contactsList);
  };

  const checkSentMessages = async () => {
    if (user) {
      const now = Timestamp.now();
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const messagesRef = collection(db, "contacts");
      const q = query(
        messagesRef,
        where("userId", "==", user.uid),
        where("timestamp", ">=", Timestamp.fromDate(startOfDay))
      );
      const querySnapshot = await getDocs(q);
      setSentToday(querySnapshot.size); // 今日送ったメッセージの数を取得
      deleteOldMessages(); // 2週間経過したメッセージを削除
    }
  };

  const deleteOldMessages = async () => {
    const now = Timestamp.now();
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14); // 2週間前の日時

    const messagesRef = collection(db, "contacts");
    const q = query(
      messagesRef,
      where("timestamp", "<", Timestamp.fromDate(twoWeeksAgo))
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref); // 2週間前のメッセージを削除
    });
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm("本当にログアウトしますか？");
    if (confirmLogout) {
      try {
        await signOut(auth);
        alert("ログアウトしました");
        setUser(null);
        router.push("/");
      } catch (error) {
        console.error("ログアウト中にエラーが発生しました: ", error);
      }
    }
  };

  const handleSave = async () => {
    if (user && displayName.trim()) {
      try {
        await updateProfile(user, { displayName });
        alert("プロフィールが更新されました");
        setIsEditing(false);
      } catch (error) {
        console.error("プロフィールの更新中にエラーが発生しました: ", error);
      }
    } else {
      alert("新しいユーザー名を入力してください");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setDisplayName(user?.displayName || "");
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (contactMessage.trim() === "") {
      toast({
        title: "エラー",
        description: "お問い合わせ内容を入力してください",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (sentToday >= 15) {
      toast({
        title: "制限",
        description: "1日に送信できるメッセージは15件までです。",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (user) {
      const contactData = {
        userId: user.uid,
        userName: displayName,
        email: user.email,
        message: contactMessage,
        timestamp: Timestamp.now(),
      };

      try {
        await addDoc(collection(db, "contacts"), contactData);
        alert("お問い合わせが送信されました");
        setContactMessage("");
        setIsContactFormVisible(false);
        checkSentMessages(); // 送信後、今日送信した件数を再チェック
      } catch (error) {
        console.error("送信エラー: ", error);
        alert("送信に失敗しました");
      }
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="xl" color="teal" />
        <p className={styles.loadingText}>ユーザー情報を取得中...</p>
      </div>
    );
  }

  return (
    <div className={styles.mypageContainer}>
      {user ? (
        <div className={styles.profileCard}>
          <div className={styles.avatarContainer}>
            <img
              src={user.photoURL || "/default-avatar.png"}
              alt="プロフィール画像"
              className={styles.avatar}
            />
            {isEditing ? (
              <div className={styles.editContainer}>
                <h3>編集画面</h3>
                <Input
                  placeholder="新しいユーザー名を入力"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  mt={4}
                  className={styles.Input_text}
                />
                <div onClick={handleSave} className={styles.updateButton}>
                  ユーザー名を更新
                </div>
                <div onClick={handleCancel} className={styles.closeButton}>
                  閉じる
                </div>
              </div>
            ) : (
              <div>
                <div onClick={() => setIsEditing(true)} className={styles.button01}>
                  編集
                </div>
              </div>
            )}
          </div>

          <div className={styles.profileCard_sub}>
            <h1 className={styles.my_page_text}>-マイページ-</h1>
            <h1 className={styles.username}>{displayName} さん</h1>
            <p className={styles.userEmail}>{user.email}</p>
          </div>
        </div>
      ) : (
        <div className={styles.loginPrompt}>
          <p>ログインしていません。</p>
          <Button onClick={onOpen} className={styles.button}>
            ログイン
          </Button>
        </div>
      )}

      {user && !isEditing && !isAdmin && (
        <div className={styles.contactForm_container}>
          {/* ここからお問い合わせフォームを最初から表示 */}
          <div className={styles.contactForm}>
            <h2>お問い合わせ</h2>
            <form onSubmit={handleContactSubmit}>
              <Textarea
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="お問い合わせ内容を入力"
                size="sm"
                rows={4}
              />
              <Button type="submit" mt={4} colorScheme="teal">
                送信
              </Button>
            </form>
          </div>
          <div className={styles.logoutContainer}>
            <div onClick={handleLogout} className={styles.button_logout}>
              ログアウト
            </div>
          </div>
        </div>
      )}

      {isAdmin && (
        <div className={styles.adminPanel}>
          <h2>お問い合わせ内容（管理者専用）</h2>
          <div className={styles.contactsList}>
            {contacts.map((contact) => (
              <div key={contact.id} className={styles.contactItem}>
                <h3>{contact.userName} ({contact.email})</h3>
                <p>{contact.message}</p>
                <Text fontSize="sm" color="gray.500">
                  {new Date(contact.timestamp.seconds * 1000).toLocaleString()}
                </Text>
              </div>
            ))}
          </div>
          <div className={styles.logoutContainer}>
            <div onClick={handleLogout} className={styles.button_logout}>
              ログアウト
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
    
  );
};

export default Mypage;