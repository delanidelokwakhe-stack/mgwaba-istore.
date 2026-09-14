import { Copy, FileUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

export function BankTransfer({
  orderNumber,
  onFileChange,
}: {
  orderNumber: string;
  onFileChange: (file: File | null) => void;
}) {
  const { bank } = useStore();

  const [fileName, setFileName] = useState("");

  const rows = [
    ["Business Name", bank.businessName],
    ["Bank Name", bank.bankName],
    ["Account Holder", bank.accountHolder],
    ["Account Number", bank.accountNumber],
    ["Branch Code", bank.branchCode],
    ["Account Type", bank.accountType],
    ["Order Number", orderNumber],
  ];

  const copyDetails = async () => {
    const details = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
    try {
      await navigator.clipboard.writeText(details);
      toast.success("Bank details copied");
    } catch {
      toast.error("Could not copy bank details");
    }
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      setFileName("");
      onFileChange(null);
      return;
    }
    setFileName(file.name);
    onFileChange(file);
    toast.success("Proof of payment selected");
  };
  return (
    <div className="space-y-6">
      {" "}
      <div className="rounded-xl border p-5">
        {" "}
        <div className="mb-4 flex items-center justify-between">
          {" "}
          <div>
            {" "}
            <h3 className="font-semibold">Bank Transfer / EFT</h3>{" "}
            <p className="text-sm text-muted-foreground">
              {" "}
              Use the details below to complete your payment.{" "}
            </p>{" "}
          </div>{" "}
          <Button type="button" variant="outline" size="sm" onClick={copyDetails}>
            {" "}
            <Copy className="mr-2 h-4 w-4" /> Copy{" "}
          </Button>{" "}
        </div>{" "}
        <div className="space-y-3">
          {" "}
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between gap-4 border-b pb-2 last:border-0"
            >
              {" "}
              <span className="text-sm text-muted-foreground"> {label} </span>{" "}
              <span className="text-right font-medium"> {value} </span>{" "}
            </div>
          ))}{" "}
        </div>{" "}
      </div>{" "}
      <div className="rounded-xl border p-5">
        {" "}
        <h3 className="mb-2 font-semibold">Upload Proof of Payment</h3>{" "}
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed p-4">
          {" "}
          <FileUp className="h-5 w-5" />{" "}
          <div>
            {" "}
            <p className="font-medium"> {fileName || "Choose payment proof"} </p>{" "}
            <p className="text-sm text-muted-foreground"> PDF, JPG or PNG </p>{" "}
          </div>{" "}
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={handleFileChange}
          />{" "}
        </label>{" "}
      </div>{" "}
    </div>
  );
}
