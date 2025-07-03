import { useState } from "react";
import { i18n } from "../utils/i18n";
import { Bucket, useBucketList, useAssetList, Asset } from "../hooks/assets";
import { faFile, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { selectFile } from "../utils/file";

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
        className={`p-2 rounded-md bg-blue-500 hover:bg-blue-600 cursor-pointer flex flex-row gap-2 text-white items-center ${className} `}
        onClick={() => setIsOpen((open) => !open)}
      >
        <div className="flex flex-row gap-2 items-center justify-center min-w-16 min-h-16">
          {is_image(value) ? (
            <img
              src={value}
              alt="Asset"
              className="max-w-16 max-h-16 object-contain rounded-md"
            />
          ) : (
            <FontAwesomeIcon icon={faFile} className="w-16 h-16 text-4xl" />
          )}
        </div>
        {value || i18n("Select Asset")}
      </button>
      {isOpen && <AssetSelector onChange={onChange} value={value} />}
    </>
  );
};

const is_image = (url: string) => {
  return url.endsWith(".png") || url.endsWith(".jpg") || url.endsWith(".jpeg");
};

interface AssetSelectorProps {
  onChange?: (url: string) => void;
  value?: string;
}

const AssetSelector = ({ onChange, value }: AssetSelectorProps) => {
  const [bucketList] = useBucketList();

  return (
    <div className="border-2 rounded-md p-2 border-blue-500 border-t-0">
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
  const [thumbnailList, refreshThumbnailList] = useAssetList(
    bucket.name,
    0,
    10
  );
  return (
    <div className="flex flex-row gap-2 flex-wrap m-auto">
      {thumbnailList.map((thumbnail, idx) => (
        <Thumbnail
          key={idx}
          thumbnail={thumbnail}
          value={value}
          onChange={onChange}
          className="m-2"
        />
      ))}
      <button
        className="p-2 rounded-md bg-gray-500 hover:bg-blue-600 cursor-pointer text-white w-20 h-20 m-2"
        onClick={async () => {
          await addAsset(bucket.name);
          await refreshThumbnailList();
        }}
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>
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
        backgroundImage: `linear-gradient(rgba(50, 50, 50, 0.5), rgba(50, 50, 50, 0.0)), url(${thumbnail.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onClick={() => {
        onChange?.(thumbnail.url);
      }}
    >
      <span className="text-white text-sm">{thumbnail.key}</span>
      <span className="text-white text-xs">
        {bytes_to_human_size(thumbnail.size)}
      </span>
    </div>
  );
};

const AM_URL = "http://localhost:8004";

const addAsset = async (bucket: string) => {
  const file: File | undefined = await selectFile("image/*");

  if (!file) {
    return;
  }

  const file_name = file.name;
  const response = await fetch(`${AM_URL}/${bucket}/${file_name}`, {
    method: "PUT",
    body: file,
  });

  const data = await response.json();
  console.log(data);
};
