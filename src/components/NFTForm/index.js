import React, { useMemo, useState } from "react";
import ReactImageUploading from "react-images-uploading";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uploadToBucket } from "../../s3client";

import { AiFillCloseCircle } from "react-icons/ai";

import styles from "./NFTForm.module.css";

// import PlaceholderImg from "../ErrorPlaceholderImg.svg"

function ToastWithLink({ link, text, target }) {
  return <p onClick={() => window.open(link, target)}>{text}</p>;
}

export default function NFTForm() {
  const [isLoading, setIsLoading] = useState(false);

  // const [NftCollName, setNftCollName] = useState("");
  const [NftName, setNftName] = useState("");
  const [NftDesc, setNftDesc] = useState("");
  const [NftImage, setNftImage] = useState(null);

  const [progress, setProgress] = useState(0);

  // const errorImgPath = "https://i.picsum.photos/id/646/1080/1080.jpg?hmac=Rc3YybSQ80mpjJrQFd6DPjxqs3WI6t0zIaz_aS-iClM"
  const errorImgPath = undefined; //PlaceholderImg;
  const BaseTxnUrl = "https://explorer.devnet.aptos.dev/txn/";

  const handleCreateNFT = (name, desc, file) => {
    setIsLoading(true);
    setProgress(0);

    const collectionName = "collName" + Date.now();

    if (!file) {
      alert("No file selected!");
      setIsLoading(false);
      return;
    }

    const fileName = (collectionName + name + file.name).replace(" ", "_");

    uploadToBucket(file, fileName, setProgress).then((url) => {
      console.log(url);
      window.martian.createNFTCollection(
        collectionName,
        "Demo NFT Collection",
        "https://aptos.dev",
        window.martian.address,
        (resp) => {
          if (resp.status === 200) {
            window.martian.createNFT(
              collectionName,
              name,
              desc,
              url,
              window.martian.address,
              (resp) => {
                if (resp.status === 200) {
                  // console.log("NFT is minted successfully.")

                  setIsLoading(false);

                  setNftName("");
                  setNftDesc("");
                  setNftImage(null);

                  toast.success(
                    <ToastWithLink
                      link={BaseTxnUrl + resp.data.txnHash.txnHash}
                      text={
                        "Transaction is submitted successfully (Click to view in explorer)"
                      }
                      target={"_blank"}
                    />
                  );
                } else {
                  console.log(resp);

                  setIsLoading(false);
                  toast.error(resp.message);
                }
              }
            );
          } else {
            console.log(resp);

            setIsLoading(false);
            toast.error(resp.message);
          }
        }
      );
    });
  };

  const progressPercent = useMemo(
    () => parseInt(progress * 100) + "%",
    [progress]
  );

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ width: "auto", cursor: "pointer" }}
      />
      <div
        className={[
          "flex flex-col justify-evenly items-center",
          styles.container,
        ].join(" ")}
      >
        <h2 style={{ fontWeight: "600" }}>Create NFT</h2>

        <input
          className="input s-step-1"
          placeholder="NFT name"
          type="text"
          onChange={(e) => setNftName(e.target.value)}
          value={NftName}
        />
        <input
          className="input s-step-2"
          placeholder="NFT Description"
          type="text"
          onChange={(e) => setNftDesc(e.target.value)}
          value={NftDesc}
        />
        <ReactImageUploading value={NftImage} onChange={setNftImage}>
          {({ onImageUpload, dragProps, isDragging, onImageRemove }) => (
            <div
              onClick={onImageUpload}
              {...dragProps}
              className={[
                "input",
                styles.uploader,
                isDragging ? styles.uploaderIsDragging : null,
              ].join(" ")}
            >
              {NftImage?.[0]?.dataURL ? (
                <div>
                  <img
                    width="200px"
                    height="200px"
                    style={{
                      border: "none",
                      background: "black",
                      display: "block",
                    }}
                    src={NftImage?.[0].dataURL}
                    alt=""
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = errorImgPath;
                      e.target.style.border = "1px solid #4e4e4e";
                    }}
                  />
                  <div
                    className={styles.imageDeleteBtn}
                    onClickCapture={() => onImageRemove(0)}
                  >
                    <AiFillCloseCircle size={24} />
                  </div>
                </div>
              ) : (
                <p
                  style={{
                    fontSize: "16px",
                    // textTransform: "uppercase",
                    textAlign: "center",
                    fontWeight: "400",
                  }}
                >
                  Choose an image
                  <br />
                  <br />
                  or
                  <br />
                  <br />
                  drag it here
                </p>
              )}
            </div>
          )}
        </ReactImageUploading>

        <div
          onClick={() =>
            !isLoading && handleCreateNFT(NftName, NftDesc, NftImage?.[0]?.file)
          }
          className="filledBtn"
          style={{
            color: "black",
            fontWeight: "bold",
            background:
              "linear-gradient(90deg, #09f0e2 0%, #35f46b " +
              (isLoading
                ? progressPercent + ", #333333 " + progressPercent
                : "100%") +
              ")",
            cursor: isLoading ? "default" : "pointer",
          }}
        >
          {isLoading ? progressPercent : "Create NFT"}
        </div>
      </div>
    </>
  );
}
