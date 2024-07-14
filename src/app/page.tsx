"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [result, setResult] = useState<
    | {
        countries: string[];
        duration: number;
      }
    | undefined
  >({
    countries: ["ahmed", "sad", "asdasd"],
    duration: 1111,
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(`/api/search?q=${input}`);
      } catch (error) {
        setError(error as string);
        console.log(error);
      }
    };
    // if (!input) {
    //   return setResult(undefined);
    // }
    fetchCountries();
  }, [input]);

  return (
    <main>
      <section className="container mx-auto mt-[200px] flex flex-col gap-20 justify-center items-center">
        <div className="flex flex-col justify-center items-center gap-6 text-center">
          <h1 className="text-6xl font-bold">SpeedSearch ⚡</h1>
          <p className="text-gray-400 text-2xl">
            A high-performance API built with Hono, Next.js and Cloudflare.{" "}
            <br /> Type a query below and get your results in miliseconds.
          </p>
        </div>
        <div className="flex gap-2 flex-col">
          <label htmlFor="country" className="ml-2 text-gray-700">
            Enter Country Name:
          </label>
          <div className="flex flex-col text-lg bg-gray-200 outline-none  py-2 rounded-md text-gray-600 w-fit">
            <input
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
              }}
              type="text"
              id="country"
              name="country"
              placeholder="Country Name"
              className="bg-gray-200 outline-none px-5  rounded-md text-gray-600 w-fit"
            />
            <div className="flex flex-col mt-2">
              <div className="flex flex-col">
                {result &&
                  result.countries.map((country, i) => (
                    <p
                      className="px-5 py-1 hover:bg-gray-100 transition-all"
                      key={i}
                    >
                      {country}
                    </p>
                  ))}
              </div>
              <div className="flex gap-10 text-base text-gray-500 px-4 pt-1 border-t-2 border-gray-100">
                <p>{result?.countries.length} Countries Found</p>
                <p>Duration: {result?.duration} ms</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
