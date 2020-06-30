import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import routes from '../constants/routes.json';
import styles from './Home.css';
import SelectWoWDir from '../features/config/SelectWowDir';
import { selectPath } from '../features/config/configSlice';
import removeCurseSrc from '../assets/removecurse.jpg';
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
