import swagger from "@elysiajs/swagger"

const document = swagger({
  documentation: {
    info: {
      title: "IE307 BACK END",
      version: "0.0.1",
      contact: {
        name: "CustomAFK",
        url: "https://github.com/QuangPhamvt",
        email: "quangpm220503vt@gmail.com",
      },
    },
    tags: [
      { name: "Auth", description: "Use to [signIn | signOut | signUp]" },
      { name: "Post" },
      { name: "User" },
      { name: "Stories" },
      { name: "Follow" },
      { name: "Chat" },
      { name: "Websocket" },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
        },
      },
    },
  },
  path: "/api/v1/document",
  autoDarkMode: false,
})
export default document
