import { api } from "~/trpc/server";
import Input from "./_components/Input";
import { Map } from "./_components/Map";
import { TableComponent } from "./_components/Table";



export default async function Home() {
  const locationsData=await api.getUserGeoLocations.query()

  return (
    <div className="bg-slate-300 p-4">
      <section id="global-alert" className="m-5"/>
      <Input />
      <hr className="m-4" />
      <main className="grid grid-cols-2 gap-x-3 justify-center min-h-screen bg-slate-300">
        <Map />
        <TableComponent locationsData={locationsData.data}  />
      </main>
    </div>
  );
}