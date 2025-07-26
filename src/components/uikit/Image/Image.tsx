import styles from './Image.module.css';

export const Image = ({ src }: { src?: string }) => {
  if (src) {
    return <img className={styles.image} src={src} alt="image" />;
  }
  return <div className={styles.placeholder}>image placeholder</div>;
};
