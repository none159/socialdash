"use client";

import Link from "next/link";
import React, { useRef, useState, useEffect } from "react";

interface Country {
  cca2: string;
  name: {
    common: string;
  };
}

const Signup = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const numberregex = /^[\+]?[0-9]{0,3}\W?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/im;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;

  const [wronginput, setwronginput] = useState<{
    phone: boolean;
    email: boolean;
    password: boolean;
  }>({
    phone: false,
    email: false,
    password: false,
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [response, setresponse] = useState<string>("");

  const handlesubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const phone = formData.get("phone")?.toString() || "";
      const email = formData.get("email")?.toString() || "";
      const password = formData.get("password")?.toString() || "";
      formData.set("country", selectedCountry);

      const phoneError = !numberregex.test(phone);
      const emailError = !emailRegex.test(email);
      const passwordError = !passwordRegex.test(password);

      setwronginput({
        phone: phoneError,
        email: emailError,
        password: passwordError,
      });

      if (!phoneError && !emailError && !passwordError) {
        const res = await fetch("/api/register", {
          method: "POST",
          body: formData,
        });
        const result = (await res.json()) as { redirect?: string; message: string };
        if (res.ok && result.redirect) {
          window.location.href = result.redirect;
        }
        setresponse(result.message);
      }
    }
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
  };

  useEffect(() => {
    const fetchCountries = async () => {
      const res = await fetch("https://restcountries.com/v3.1/all");
      const countryData = (await res.json()) as Country[];
      const sortedCountries = countryData
        .filter((country) => country.name.common !== "Israel")
        .sort((a, b) => a.name.common.localeCompare(b.name.common));
      setCountries(sortedCountries);
    };

    fetchCountries();
  }, []);

  return (
    <section className="relative top-[250px] bg-gray-700 shadow-black shadow-2xl rounded-md w-fit mx-auto">
      <form
        className="grid place-items-center gap-10 font-light p-[20px]"
        ref={formRef}
        onSubmit={handlesubmit}
      >
        <h2 className="text-3xl">Sign Up</h2>
        <div className="grid gap-5 place-items-center">
          <h3>First Name :</h3>
          <input
            type="text"
            name="firstname"
            required
            className="outline-none text-sm rounded text-black bg-gray-500 p-[5px] w-[300px]"
          />
          <h3>Last Name :</h3>
          <input
            type="text"
            name="lastname"
            required
            className="outline-none text-sm rounded text-black bg-gray-500 p-[5px] w-[300px]"
          />
          <h3>Username :</h3>
          <input
            type="text"
            name="username"
            required
            className="outline-none text-sm rounded text-black bg-gray-500 p-[5px] w-[300px]"
          />
          <h3>Phone Number :</h3>
          <input
            type="tel"
            name="phone"
            required
            className={`outline-none text-sm rounded text-black p-[5px] w-[300px] ${
              wronginput.phone ? "bg-red-200" : "bg-gray-500"
            }`}
          />
          <h3>Country :</h3>
          <select
            name="country"
            value={selectedCountry}
            onChange={handleCountryChange}
            required
            className="outline-none text-sm rounded text-black bg-gray-500 p-[5px] w-[300px]"
          >
            <option value="" disabled>
              Select your country
            </option>
            {countries.map((country) => (
              <option key={country.cca2} value={country.name.common}>
                {country.name.common}
              </option>
            ))}
          </select>
          <h3>Email :</h3>
          <input
            type="email"
            name="email"
            required
            className={`outline-none text-sm rounded text-black p-[5px] w-[300px] ${
              wronginput.email ? "bg-red-200" : "bg-gray-500"
            }`}
          />
          <h3>Password :</h3>
          <input
            type="password"
            name="password"
            required
            className={`outline-none text-sm rounded text-black p-[5px] w-[300px] ${
              wronginput.password ? "bg-red-200" : "bg-gray-500"
            }`}
          />
        </div>
        <button
          type="submit"
          className="bg-white text-gray-500 p-[5px] w-[150px] rounded hover:bg-gray-500 hover:text-white transition-all ease-in-out duration-[500ms]"
        >
          Sign Up
        </button>
        <h4>
          Click Here To{" "}
          <Link href="/Signin" className="text-blue-800 underline">
            SignIn
          </Link>
        </h4>
        {response && (
          <h3
            className={`${
              response === "User Registered" ? "bg-green-600" : "bg-red-600"
            } p-[10px] rounded`}
          >
            {response}
          </h3>
        )}
      </form>
    </section>
  );
};

export default Signup;
