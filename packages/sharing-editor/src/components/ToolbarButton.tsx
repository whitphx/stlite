import styles from "./ToolbarButton.module.scss";

interface ToolbarButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
}

function ToolbarButton({ children, icon, ...restProps }: ToolbarButtonProps) {
  return (
    <button {...restProps} className={styles.button}>
      {icon ? <span className={styles.icon}>{icon}</span> : null}
      {children}
    </button>
  );
}

export default ToolbarButton;
