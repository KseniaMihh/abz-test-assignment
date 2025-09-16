import React from "react";

const SuccessMessage = () => {
  return (
    <div className="success-message">
      <h1 style={{ marginBottom: "50px", marginTop: "0" }}>
        User successfully registered
      </h1>
      <img src="/SuccessImg.svg" alt="Success" className="success-image" />
    </div>
  );
};

export default SuccessMessage;
