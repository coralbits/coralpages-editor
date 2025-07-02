import { useEffect, useState } from "react";

const AM_URL = "http://localhost:8004";

export interface Bucket {
  name: string;
  creation_date: string;
}

const getBucketList = async (): Promise<Bucket[]> => {
  const response = await fetch(`${AM_URL}/`);
  const data = await response.json();
  return data.buckets;
};

export const useBucketList = () => {
  const [bucketList, setBucketList] = useState<Bucket[]>([]);

  useEffect(() => {
    const fetchBucketList = async () => {
      const bucketList = await getBucketList();
      setBucketList(bucketList);
    };
    fetchBucketList();
  }, []);

  return [bucketList];
};

export interface Asset {
  key: string;
  creation_date: string;
  size: number;
  url: string;
}

const getAssetList = async (
  bucket: string,
  offset: number,
  limit: number
): Promise<Asset[]> => {
  const response = await fetch(
    `${AM_URL}/${bucket}/?offset=${offset}&limit=${limit}`
  );
  const data = await response.json();
  return data.contents.map((content: any) => ({
    key: content.key,
    creation_date: content.creation_date,
    size: content.size,
    url: `${AM_URL}/${bucket}/${content.key}`,
  }));
};

export const useAssetList = (bucket: string, offset: number, limit: number) => {
  const [assetList, setAssetList] = useState<Asset[]>([]);

  useEffect(() => {
    const fetchThumbnailList = async () => {
      const assetList = await getAssetList(bucket, offset, limit);
      setAssetList(assetList);
    };
    fetchThumbnailList();
  }, []);

  return [assetList];
};
