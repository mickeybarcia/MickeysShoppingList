import { useEffect, useState } from 'react';
import { subscribeToDataChanges } from 'src/services/FirebaseService';

const useFirebaseQuery = (path) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const onDataChange = (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.val());
        setIsLoading(false);
      } else {
        setData(undefined);
        setIsLoading(false);
      }
    };

    const onError = (error) => {
      setError(error);
      setIsLoading(false);
    };

    const unsubscribe = subscribeToDataChanges(path, onDataChange, onError);

    return () => {
      unsubscribe();
    };
  }, [path]);

  return { isLoading, data, error };
};

export default useFirebaseQuery;
