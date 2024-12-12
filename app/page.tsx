"use client";


import { useState } from "react";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addIngredient = () => {
    if (inputValue.trim()) {
      setIngredients([...ingredients, inputValue.trim()]);
      setInputValue("");
    }
  };

  const fetchRecipes = async () => {
    if (ingredients.length === 0) return;
    setLoading(true);
    try {
      const ingredientQuery = ingredients.join(",");
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientQuery}`
      );
      const data = await response.json();
      setRecipes(data.meals || []);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-black">Buzdolabı Tarifleri</h1>
        <p className="text-xl font-bold mb-4 text-black">Lütfen Malzeme Girin</p>
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Malzeme ekle..."
            className="text-black p-2 border rounded-md w-full focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={addIngredient}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
          >
            Ekle
          </button>
        </div>
        <div className="mb-4">
          {ingredients.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {ingredients.map((item, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                >
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={fetchRecipes}
          className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "Yükleniyor..." : "Tarif Bul"}
        </button>
        <div className="mt-6">
          {recipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recipes.map((recipe) => (
                <div
                  key={recipe.idMeal}
                  className="p-4 border rounded-md shadow-sm bg-gray-500"
                >
                  <img
                    src={recipe.strMealThumb}
                    alt={recipe.strMeal}
                    className="w-full h-32 object-cover rounded-md mb-2"
                  />
                  <h3 className="text-lg font-bold">{recipe.strMeal}</h3>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Henüz tarif bulunamadı.</p>
          )}
        </div>
      </div>
    </main>
  );
}
