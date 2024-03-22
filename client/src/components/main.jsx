import React, { useState } from "react";
import styles from "../styles/MainFC.module.scss";
import { Link } from "react-router-dom";

const FIELDS = {
  USERNAME:'username',
  ROOM:'room',
}

const Main = () => {
  const {USERNAME,ROOM} = FIELDS

  const [values,setValues] = useState({ [USERNAME]:'',[ROOM]:''})
  const handleChange = ({ target: { value, name } }) => {
    setValues({ ...values, [name]: value });
  };
  const handleClick = (e) => {
    const isDisabled = Object.values(values).some((v) => !v);
    if (isDisabled) e.preventDefault();
  };



  console.log(values)

  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Join</h1>

        <form className={styles.form}>
          <div className={styles.group}>
            <input
              type="text"
              name="username"
              value={values[USERNAME]}
              className={styles.input}
              onChange={handleChange}
              id=""
              autoComplete="off"
              placeholder="Your Name"
              required
            />
          </div>
          <div className={styles.group}>
            <input
              type="text"
              name="room"
              value={values[ROOM]}
              className={styles.input}
              onChange={handleChange}
              id=""
              autoComplete="off"
              placeholder="Room Name"
              required
            />
          </div>
          <Link to={`/chat?name=${values[USERNAME]}&room=${values[ROOM]}`}
            className={styles.group}
            onClick={handleClick}
          >
            <button type="submit" className={styles.button}> Sign In</button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Main;
