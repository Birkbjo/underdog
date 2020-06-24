import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import routes from '../constants/routes.json';
import styles from './Home.css';
import SelectWoWDir from '../features/config/SelectWowDir';
import { selectPath } from '../features/config/configSlice';

export default function Home(): JSX.Element {
  const path = useSelector(selectPath);

  return !path ? (
    <SelectWoWDir />
  ) : (
    <div className={styles.container} data-tid="container">
      <h2>Home</h2>
      <Link to={routes.COUNTER}>to Counters</Link>
      <br />
      <Link to={routes.ADDONS}>to Addons</Link>
      <SelectWoWDir />
    </div>
  );
}
