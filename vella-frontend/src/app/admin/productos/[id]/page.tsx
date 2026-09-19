import EditProductClient from "./EditProductClient";

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditProductClient id={Number(id)} />;
}
