# PDF-Speek-Pro

An **AI-Powered Interactive Document Chat Application** that enables users to upload PDFs and interact with them using AI. The system automatically generates embeddings and provides accurate answers to user queries based on the document's content.

---

## 📸 Screenshots

<img width="623" alt="PDF-Speek-Pro" src="https://github.com/user-attachments/assets/07eba5fd-237c-4dff-ad82-11f54f45f9d1" />
<img width="623" alt="Screenshot" src="https://github.com/user-attachments/assets/d3562c08-917f-454b-a89a-5c0fd9f28094" />

---

## 🚀 Features

✅ **AI-Powered Document Interaction** - Upload PDFs and ask questions about their content.
✅ **Automatic Embeddings Generation** - Uses advanced AI to process and understand the document.
✅ **Fast & Accurate Responses** - Provides precise answers based on the document’s content.
✅ **Secure Authentication** - Uses Clerk for user authentication and session management.
✅ **Modern UI** - Built with ShadCN for a clean and interactive design.
✅ **Serverless & Scalable** - Deployed on Next.js with Firebase for seamless scalability.

---

## 🛠️ Tech Stack

- **Next.js** - Server-side actions and API handling
- **ShadCN** - Modern and responsive UI components
- **LangChain & Gemini API** - AI-powered responses and embedding generation
- **Clerk** - Secure user authentication & session management
- **Firebase** - Cloud storage for user data and PDF references
- **Pinecone DB** - storage to store AI embeddings in namespace

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Firebase account setup
- Clerk API keys
- Gemini API access

### Installation
1. **Clone the Repository**
```bash
  git clone https://github.com/your-username/pdf-speek-pro.git
  cd pdf-speek-pro
```
2. **Install Dependencies**
```bash
  npm install
```
3. **Set up Environment Variables**
   Create a `.env.local` file and add the required API keys:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-key
   CLERK_SECRET_KEY=your-clerk-secret-key
   FIREBASE_API_KEY=your-firebase-api-key
   GOOGLE_GENAI_API_KEY=your-gemini-api-key
   ```
4. **Run the Development Server**
```bash
  npm run dev
```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Project Structure
```
📂 pdf-speek-pro
 ├── 📁 src
 │   ├── 📁 app  # Next.js pages & API routes
 │   ├── 📁 components  # UI components using ShadCN
 │   ├── 📁 lib  # Utility functions
 │   ├── 📁 services  # AI, Clerk, and Firebase integrations
 │   ├── 📁 styles  # Global styles
 │   └── 📁 hooks  # Custom React hooks
 ├── .env.local  # Environment variables
 ├── package.json  # Dependencies
 ├── next.config.js  # Next.js config
 ├── README.md  # Project documentation
```

---

## 📌 Roadmap
- [ ] Improve AI accuracy with RAG (Retrieval-Augmented Generation)
- [ ] Support for more document formats (Word, Excel, etc.)
- [ ] Enhance UI with animations and theme options
- [ ] Multi-user collaboration & document sharing

---

## 💡 Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repo
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Added new feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a Pull Request

---

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact
For queries or feedback, reach out via [sankalp.develop@gmail.com](mailto:sankalp.develop@gmail.com) or open an issue.

---

### ⭐ If you like this project, don't forget to star the repository!

