import styles from "./ToolbarButton.module.scss";

function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={styles.button} />;
}

export default Button;
