"use client"

import React, { useEffect, useState } from "react";
import { auth } from "../hooks/firebase";
import { signOut, onAuthStateChanged, User, updateProfile } from "firebase/auth";
import Footer from "../components/Footer";
import { useRouter } from "next/navigation";
import styles from "./Mypage.module.css";
import { useDisclosure, Spinner, Input, Button, Textarea } from "@chakra-ui/react";
import LoginModal from "../ Login/Login";
import emailjs from "emailjs-com";  // EmailJS をインポート

const Mypage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false); // 編集モードの状態管理
  const [contactMessage, setContactMessage] = useState<string>(""); // お問い合わせ内容
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setDisplayName(currentUser?.displayName || "");
      setLoading(false);
    });
    return unsubscribe;
  }, []);

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
        await updateProfile(user, { displayName }); // ユーザー名の更新
        alert("プロフィールが更新されました");
        setIsEditing(false); // 編集モードを終了
      } catch (error) {
        console.error("プロフィールの更新中にエラーが発生しました: ", error);
      }
    } else {
      alert("新しいユーザー名を入力してください");
    }
  };

  const handleCancel = () => {
    setIsEditing(false); // 編集をキャンセル
    setDisplayName(user?.displayName || ""); // 元のユーザー名に戻す
  };

  // お問い合わせフォームの送信
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const templateParams = {
      user_name: displayName, // ユーザー名
      message: contactMessage, // お問い合わせ内容
    };
  
    // EmailJS APIを送信
    emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!, 
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!, 
      templateParams,
      process.env.NEXT_PUBLIC_EMAILJS_USER_ID!
    )
    .then((response) => {
      alert("お問い合わせが送信されました");
      setContactMessage(""); // フォームをリセット
    })
    .catch((error) => {
      console.error("送信エラー: ", error);
      alert("送信に失敗しました");
    });
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

      {user && !isEditing && (
        <div>
        {/* お問い合わせフォーム追加 */}
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

      <LoginModal isOpen={isOpen} onClose={onClose} />
      <Footer />
    </div>
  );
};

export default Mypage;