import { useState } from "react";
import { i18n } from "../utils/i18n";
import { Bucket, useBucketList, useAssetList, Asset } from "../hooks/assets";

export interface AssetSelectorButtonProps {
  placeholder: string;
  name: string;
  value: string;
  className?: string;
  onChange: (value: string) => void;
}

export const AssetSelectorButton = ({
  placeholder,
  name,
  value,
  className,
  onChange,
}: AssetSelectorButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className={`p-2 rounded-md bg-blue-500 hover:bg-blue-600 cursor-pointer text-white ${className} `}
        onClick={() => setIsOpen((open) => !open)}
      >
        {value || i18n("Select Asset")}
      </button>
      {isOpen && <AssetSelector onChange={onChange} value={value} />}
    </>
  );
};

interface AssetSelectorProps {
  onChange?: (url: string) => void;
  value?: string;
}

const AssetSelector = ({ onChange, value }: AssetSelectorProps) => {
  const [bucketList] = useBucketList();

  return (
    <div className="border-2 rounded-md p-2 border-blue-500 border-t-0 bg-gray-700">
      <div className="flex flex-col gap-2">
        {bucketList.map((bucket) => (
          <div key={bucket.name}>
            <h3
              key={bucket.name}
              className="font-bold border-b-2 border-b-blue-500"
            >
              {bucket.name}
            </h3>
            <BucketThumbnailList
              bucket={bucket}
              onChange={onChange}
              value={value}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-row gap-2 justify-center m-4">
        <button className="p-2 rounded-md bg-blue-500 hover:bg-blue-600 cursor-pointer text-white">
          {i18n("Create Bucket")}
        </button>
      </div>
    </div>
  );
};

const BucketThumbnailList = ({
  bucket,
  onChange,
  value,
}: {
  bucket: Bucket;
  onChange?: (url: string) => void;
  value?: string;
}) => {
  const [thumbnailList] = useAssetList(bucket.name, 0, 10);
  return (
    <div className="flex flex-row gap-2 flex-wrap">
      {thumbnailList.map((thumbnail, idx) => (
        <Thumbnail
          key={idx}
          thumbnail={thumbnail}
          value={value}
          onChange={onChange}
          className="m-2"
        />
      ))}
    </div>
  );
};

const bytes_to_human_size = (bytes: number) => {
  const sizes = ["B", "KiB", "MiB", "GiB", "TiB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
};

const Thumbnail = ({
  thumbnail,
  value,
  onChange,
  className,
}: {
  thumbnail: Asset;
  value?: string;
  onChange?: (url: string) => void;
  className?: string;
}) => {
  return (
    <div
      className={`flex flex-col gap-2 justify-between w-20 h-20 border-1 border-blue-500 rounded-md p-2 overflow-hidden  hover:bg-blue-600 transition-all duration-300 cursor-pointer ${
        value === thumbnail.url
          ? "bg-blue-600 border-blue-600 border-2"
          : "border-1 bg-gray-700"
      } ${className}`}
      style={{
        backgroundImage: `url(${thumbnail.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onClick={() => {
        onChange?.(thumbnail.url);
      }}
    >
      {value === thumbnail.url ? "ok" : "nok"}
      <span className="text-white text-sm">{thumbnail.key}</span>
      <span className="text-white text-xs">
        {bytes_to_human_size(thumbnail.size)}
      </span>
    </div>
  );
};
