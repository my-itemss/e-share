"use client";

import { useParams } from "next/navigation";
import DownloadCard from "../../../components/DownloadCard";

export default function FilePage() {
  const { id } = useParams();
  return <DownloadCard id={id} />;
}
