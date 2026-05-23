import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "next-learn",
      name: "NEXTLearn",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("NextAuth authorize attempt for:", credentials?.email);
        try {
          const res = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password
            }),
            headers: { "Content-Type": "application/json" }
          });
          
          if (!res.ok) {
            const errorText = await res.text();
            console.error("Backend login failed:", res.status, errorText);
            return null;
          }

          const user = await res.json();
          console.log("Backend login success for:", user.email);

          if (user) {
            return user;
          }
        } catch (error) {
          console.error("NextAuth authorize error:", error);
        }
        return null;
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user.id = token.id as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
