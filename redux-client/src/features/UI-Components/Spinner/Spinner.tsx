import React from "react";
import css from "./index.module.css"

export default function CircularColor() {
  return (
    <div className={css.spinnerContainer}>
      <div className={css.spinner}></div>
    </div>
  );
}
