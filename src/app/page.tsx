"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { CommandInput } from "cmdk";
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
  >();

  useEffect(() => {
    const fetchCountries = async () => {
      if (!input) {
        return setResult(undefined);
      }
      try {
        const res = await fetch(
          `https://fastapi.shebblloll.workers.dev/api/search?q=${input}`
        );
        const data = await res.json();
        console.log(data);
        setResult(data);
      } catch (error) {
        setError(error as string);
        console.log(error);
      }
    };
    fetchCountries();
  }, [input]);

  return (
    <main className="h-screen w-screen pt-40 grainy">
      <section className="container mx-auto flex flex-col gap-20 justify-center items-center duration-700 animate-in animate fade-in-20 slide-in-from-bottom-10">
        <div className="flex flex-col justify-center items-center gap-6 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold">SpeedSearch ⚡</h1>
          <p className="text-gray-400 sm:text-2xl">
            A high-performance API built with Hono, Next.js and Cloudflare.{" "}
            <br /> Type a query below and get your results in miliseconds.
          </p>
        </div>
        <div className="flex gap-2 flex-col w-fit sm:w-[600px]">
          {/* <label htmlFor="country" className="ml-2 text-gray-700">
            Enter Country Name:
          </label> */}
          <Command className=" outline-none p-2">
            <CommandInput
              value={input}
              onValueChange={setInput}
              placeholder="Search countries..."
              className="placeholder:text-zinc-500 outline-none px-3"
            />
            <CommandList>
              {result?.countries.length === 0 ? (
                <CommandEmpty>No results found.</CommandEmpty>
              ) : null}

              {result?.countries ? (
                <CommandGroup heading="Results">
                  {result?.countries.map((result) => (
                    <CommandItem
                      key={result}
                      value={result}
                      onSelect={setInput}
                    >
                      {result}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}

              {result?.countries ? (
                <>
                  <div className="h-px w-full bg-zinc-200" />

                  <p className="p-2 text-xs text-zinc-500">
                    Found {result.countries.length} results in{" "}
                    {result?.duration.toFixed(0)}ms
                  </p>
                </>
              ) : null}
            </CommandList>
          </Command>
        </div>
      </section>
    </main>
  );
}
