import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">DevisFlow IA</h1>
          </div>
          <nav className="flex gap-4">
            <Link
              href="/chat"
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              Chatbot Vision
            </Link>
            <Link
              href="/devis-texte"
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              Devis rapide
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Obtenez un devis instantané
          </h2>
          <p className="text-xl text-gray-600">
            Décrivez votre problème, obtenez une estimation immédiate grâce à
            l'IA
          </p>
        </div>

        {/* Deux options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Option 1 : Texte uniquement */}
          <Link
            href="/devis-texte"
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-transparent hover:border-blue-500"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
              <svg
                className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Option 1 : Devis rapide
            </h3>
            <p className="text-gray-600 mb-6">
              Décrivez votre problème par texte uniquement. Réponse instantanée
              avec estimation des coûts.
            </p>
            <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
              Commencer
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>

          {/* Option 2 : Chatbot avec photo */}
          <Link
            href="/chat"
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-transparent hover:border-indigo-500"
          >
            <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
              <svg
                className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Option 2 : Analyse visuelle
            </h3>
            <p className="text-gray-600 mb-6">
              Envoyez une photo de votre problème. L'IA analyse l'image et vous
              guide avec un devis détaillé.
            </p>
            <div className="flex items-center gap-2 text-indigo-600 font-semibold group-hover:gap-3 transition-all">
              Commencer avec photo
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 text-center">
          <div className="p-6">
            <div className="text-3xl mb-3">⚡</div>
            <h4 className="font-semibold text-gray-900 mb-2">Instantané</h4>
            <p className="text-gray-600 text-sm">
              Réponse en moins de 10 secondes
            </p>
          </div>
          <div className="p-6">
            <div className="text-3xl mb-3"></div>
            <h4 className="font-semibold text-gray-900 mb-2">Précis</h4>
            <p className="text-gray-600 text-sm">
              Analyse basée sur l'IA avancée
            </p>
          </div>
          <div className="p-6">
            <div className="text-3xl mb-3">💰</div>
            <h4 className="font-semibold text-gray-900 mb-2">Gratuit</h4>
            <p className="text-gray-600 text-sm">
              Aucun frais, aucun engagement
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-gray-500 text-sm">
          © 2026 DevisFlow IA — Propulsé par Qwen 3.8 27B via Groq
        </div>
      </footer>
    </div>
  );
}
