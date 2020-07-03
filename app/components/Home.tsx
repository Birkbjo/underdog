import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './Home.css';
import SelectWoWDir from '../features/config/SelectWowDir';
import { selectPath } from '../features/config/configSlice';
import AddonsView from '../features/AddonsView/AddonsView';
export default function Home(): JSX.Element {
  const path = useSelector(selectPath);

  return (
    <div className={styles.container} data-tid="container">
      <AddonsView />
      <SelectWoWDir />
    </div>
  );
}
