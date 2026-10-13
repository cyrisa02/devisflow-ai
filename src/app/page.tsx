"use client";

import { useState } from "react";

export default function Home() {
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur inconnue");
      }

      setResult(data.quote);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">DevisFlow IA</h1>
        <p className="text-gray-600 mb-6">
          Décrivez votre problème, obtenez un devis instantané.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Votre email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description du problème
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Fuite sous l'évier de la cuisine, ça goutte depuis ce matin..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              required
              minLength={10}
            />
          </div>

          <button
            type="submit"
            disabled={loading || description.length < 10 || !email}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Analyse en cours..." : "Générer un devis"}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
            <h2 className="text-xl font-bold text-green-900 mb-4">
              Devis préliminaire
            </h2>

            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-700">Type :</span>
                <span className="ml-2 capitalize text-gray-900">
                  {result.type_panne}
                </span>
              </div>

              <div>
                <span className="font-semibold text-gray-700">Urgence :</span>
                <span
                  className={`ml-2 capitalize ${
                    result.urgence === "haute"
                      ? "text-red-600"
                      : result.urgence === "moyenne"
                        ? "text-orange-600"
                        : "text-green-600"
                  }`}
                >
                  {result.urgence}
                </span>
              </div>

              <div>
                <span className="font-semibold text-gray-700">
                  Description technique :
                </span>
                <p className="mt-1 text-gray-900">
                  {result.description_technique}
                </p>
              </div>

              <div>
                <span className="font-semibold text-gray-700">
                  Estimation :
                </span>
                <span className="ml-2 text-2xl font-bold text-blue-600">
                  {result.estimation_prix_min}€ - {result.estimation_prix_max}€
                </span>
              </div>

              {result.questions_complementaires?.length > 0 && (
                <div>
                  <span className="font-semibold text-gray-700">
                    Questions complémentaires :
                  </span>
                  <ul className="mt-1 list-disc list-inside text-gray-900">
                    {result.questions_complementaires.map(
                      (q: string, i: number) => (
                        <li key={i}>{q}</li>
                      ),
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
