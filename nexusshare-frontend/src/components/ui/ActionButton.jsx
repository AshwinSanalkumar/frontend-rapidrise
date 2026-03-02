const ActionButton = ({ icon, title, onClick, variant = 'default' }) => {
  const styles = {
    default: "bg-gray-50 dark:bg-gray-900 text-gray-400 hover:text-indigo-600 border-gray-100 dark:border-gray-700",
    danger: "bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white border-red-100 dark:border-red-900/30"
  };

  return (
    <button 
      onClick={onClick}
      className={`p-4 rounded-2xl border transition ${styles[variant]}`} 
      title={title}
    >
      <i className={`fas ${icon}`}></i>
    </button>
  );
};

export default ActionButton;