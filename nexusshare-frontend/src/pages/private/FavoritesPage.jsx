import React from 'react';
import FileBrowser from '../../components/common/FileBrowser';

const FavoritesPage = () => {
  return (
    <FileBrowser
      title="Favorites"
      subtitle="Access your most important secured files instantly."
      initialFilter={(f) => f.isFavorite}
      emptyState={{
        icon: 'fa-heart',
        title: 'No favorites yet',
        message: 'Mark your most important files as favorites to see them here.'
      }}
    />
  );
};

export default FavoritesPage;