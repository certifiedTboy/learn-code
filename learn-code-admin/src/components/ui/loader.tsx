import styles from "./loader.module.css";

const Loader = () => {
  return (
    <div className="flex z-50 justify-center items-center w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className={styles.spinner}></div>
    </div>
  );
};

export default Loader;
