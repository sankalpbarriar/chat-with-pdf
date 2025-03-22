"use client";

import { useUser } from "@clerk/nextjs";
import { collection, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { db } from "../firebase";

//number of docs allweded
const PRO_LIMIT = 20;
const FREE_LIMIT = 2;
function useSubscription() {
  const [hasActiveMembership, setHasActiveMembership] = useState(null);
  const [isOverFileLimit, setIsOverFileLimit] = useState(false);
  const { user } = useUser();

  //   Listen to the User document
  const [snapshot, loading, error] = useDocument(
    user && doc(db, "users", user.id),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  //   Listen to the users files collection
  const [filesSnapshot, filesLoading] = useCollection(
    user && collection(db, "users", user?.id, "files")
  );

  useEffect(() => {
    if (!snapshot) return;

    const data = snapshot.data();

    // console.log("DEBUG 1" ,data)
    if (!data) return;

    // console.log("DEBUG 2" , data.hasActiveMembership)

    setHasActiveMembership(data.hasActiveMembership);
  }, [snapshot]);

  useEffect(() => {
    if (!filesSnapshot || hasActiveMembership === null) return;

    const files = filesSnapshot.docs;
    const usersLimit = hasActiveMembership ? PRO_LIMIT : FREE_LIMIT;

    console.log(
      "Checking if user is over file limit",
      files.length,
      usersLimit
    );

    setIsOverFileLimit(files.length >= usersLimit);
  }, [filesSnapshot, hasActiveMembership, PRO_LIMIT, FREE_LIMIT]);

  return { hasActiveMembership, loading, error, isOverFileLimit, filesLoading };
}

export default useSubscription;
