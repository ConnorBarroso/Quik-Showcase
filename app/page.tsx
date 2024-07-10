"use client";

import React, { useState, useEffect } from "react";
import Graphs from "./components/Graphs/Graphs";
export interface GraphData {
  timestamps: string[];
  prices: number[];
  currency: string;
  coinId: string;
}
export default function Home() {
  const [graphData, setGraphData] = useState<GraphData[] | null>(null);
  const [queryParams, setQueryParams] = useState({
    coinId: "bitcoin",
    currency: "usd",
    precision: "2",
  });
  const [isLine, setIsLine] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  let graffiti = "Change to Bar";
  if (!isLine) graffiti = "Change to Line";

  const handleEthereum = () => {
    const newQuery = {
      coinId: "ethereum",
      currency: "usd",
      precision: "2",
    };

    setQueryParams(newQuery);
  };

  const handleStEthereum = () => {
    const newQuery = {
      coinId: "staked-ether",
      currency: "usd",
      precision: "2",
    };

    setQueryParams(newQuery);
  };

  const handleCash = () => {
    const newQuery = {
      coinId: "bitcoin-cash",
      currency: "usd",
      precision: "2",
    };

    setQueryParams(newQuery);
  };
  const handleToggle = () => {
    setIsLine(!isLine);
  };

  useEffect(() => {
    const handleRequest = async () => {
      setLoading(true);
      const res = await fetch(
        `/api/getData?coinId=${queryParams.coinId}&currency=${queryParams.currency}&precision=${queryParams.precision}`
      );
      const resData = await res.json();
      console.log(resData.status);
      if (resData.status !== 200) {
        console.error(`ERROR CODE: ${resData.status}`);
        return;
      }
      const data = {
        timestamps: resData.timestamps,
        prices: resData.prices,
        currency: resData.currency,
        coinId: resData.coinId,
      };
      if (graphData === null) {
        //if there's no array, return data in an array

        setGraphData([data]);
        setLoading(false);
        return;
      } else if (graphData.length >= 3) {
        //if there are already 3 coins, remove the first coin the add the newest coin

        const newGraphData = [...graphData.slice(1), data];
        setGraphData(newGraphData);
        setLoading(false);
        return;
      }
      //spread in the old coins and add the new one.
      const newGraphData = [...graphData, data];
      setGraphData(newGraphData);
      setLoading(false);
    };
    //if there is no graphData, or you wish to add a new coin attempt the request.
    if (
      !graphData ||
      !graphData.some((coin) => coin.coinId === queryParams.coinId)
    ) {
      handleRequest();
    }
  }, [graphData, loading, queryParams]);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className=" flex-column content-center bg-white p-[20px] rounded-[5%] ">
        {loading ? (
          <div className="w-[550px] h-[400px]">
            <h1 className="text-gray-500">Loading...</h1>
          </div>
        ) : (
          graphData && <Graphs graphData={graphData} isLine={isLine} />
        )}
        <button
          onClick={handleToggle}
          className="flex justify-center text-[30px] w-[100%] mt-[5px] bg-gray-500 border border-white rounded-[50px] p-4 cursor-pointer"
        >
          {graffiti}
        </button>
      </div>
      <button
        onClick={handleEthereum}
        className="flex justify-center text-[30px] w-[50vw] mt-[5px] bg-gray-500 border border-white rounded-[50px] p-4 cursor-pointer"
      >
        Add Etherium
      </button>
      <button
        onClick={handleStEthereum}
        className="flex justify-center text-[30px] w-[50vw] mt-[5px] bg-gray-500 border border-white rounded-[50px] p-4 cursor-pointer"
      >
        Add StEtherium
      </button>
      <button
        onClick={handleCash}
        className="flex justify-center text-[30px] w-[50vw] mt-[5px] bg-gray-500 border border-white rounded-[50px] p-4 cursor-pointer"
      >
        Add Bitcoin Cash
      </button>
    </main>
  );
}
