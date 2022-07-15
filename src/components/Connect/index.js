import React, { useEffect, useState } from "react";
import { useAuth } from "../../Auth";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Connect() {
  const { setAuthAccount } = useAuth();

  const [isWalletInstalled, setIsWalletInstalled] = useState(false);

  const handleConnect = () => {
    window.martian.connect((resp) => {
      if (resp.status === 200) {
        console.log(resp.address);
        setAuthAccount({ address: resp.address });
      } else if (resp.status === 4001) {
        console.log(resp.message);

        toast.error(`User denied request to connect to this website!`);
      }
    });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if ("martian" in window) {
        setIsWalletInstalled(true);
      } else {
        setIsWalletInstalled(false);
      }
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-full w-full">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ width: "auto" }}
      />

      {isWalletInstalled ? (
        <button
          onClick={() => handleConnect()}
          className="btn"
          style={{ padding: "15px 30px" }}
        >
          Connect <span className="text-green">Aptos</span> wallet
        </button>
      ) : (
        <div
          style={{
            fontSize: "25px",
            fontWeight: "200",
            minWidth: "400px",
            width: "55%",
            textAlign: "center",
            color: "white",
          }}
        >
          <p>
            It seems like you have not installed
            <span style={{ fontWeight: "400" }} className="text-darkgreen">
              {" "}
              Martian wallet{" "}
            </span>
            extension.
          </p>
          <span
            style={{ fontWeight: "500" }}
            className="text-darkgreen hover-underline"
            onClick={() =>
              window.open(
                "https://chrome.google.com/webstore/detail/martian-wallet/efbglgofoippbgcjepnhiblaibcnclgk",
                "_blank"
              )
            }
          >
            Click here
          </span>{" "}
          to download it
        </div>
      )}
    </div>
  );
}
