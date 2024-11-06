// Header.tsx
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { Button, Box, Flex } from "@chakra-ui/react";
import { signInWithGoogle, onAuthStateChangedListener, signOutUser } from "../hooks/login"; // login.tsの関数をインポート

const Header = () => {
    const [user, setUser] = useState<User | null>(null); // User | null 型を指定

    useEffect(() => {
        // onAuthStateChangedListener でログイン状態を監視
        const unsubscribe = onAuthStateChangedListener((user) => {
            setUser(user); // ユーザーがログインしている場合、userにユーザー情報をセット
        });
        return unsubscribe; // コンポーネントがアンマウントされた時にクリーンアップ
    }, []);

    return (
        <Box as="header" bg="teal.500" p={4} color="white">
            <Flex justify="space-between" align="center">
                <Box fontSize="xl" fontWeight="bold">MyApp</Box>
                {!user ? (
                    <Flex gap={4}>
                        <Button colorScheme="blue" onClick={signInWithGoogle}>ログイン</Button>
                        
                    </Flex>
                ) : (
                    <Button colorScheme="red" onClick={signOutUser}>ログアウト</Button>
                )}
            </Flex>
        </Box>
    );
};

export default Header;
