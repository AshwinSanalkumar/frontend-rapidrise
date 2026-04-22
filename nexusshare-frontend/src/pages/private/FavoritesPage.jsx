import React from 'react';
import FileBrowser from '../../components/common/FileBrowser';

const FAVORITES_EMPTY_STATE = {
  icon: 'fa-heart',
  title: 'No favorites yet',
  message: 'Mark your most important files as favorites to see them here.'
};

const FavoritesPage = () => {
  return (
    <FileBrowser
      title="Favorites"
      subtitle="Access your most important secured files instantly."
      showFavoritesOnly={true}
      emptyState={FAVORITES_EMPTY_STATE}
    />
  );
};

export default FavoritesPage;