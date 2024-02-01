import Image from "next/image";
import Layout from "./layout";

export default function Home() {
  return (
    <Layout>
      <main className="bg-amber-700 h-full w-full">
        {/* Content specific to Home page */}
        <h3>h3 inside</h3>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam ducimus tempore temporibus possimus. Dolorem, id fuga delectus ad quia voluptas ipsam amet eaque nesciunt error hic reprehenderit magni iusto nam?</p>
      </main>
    </Layout>
    // <main className="bg-red-500">
    //   <div className="h-screen w-full bg-blue-900">
    //     <h1>Gems DAO</h1>
    //   </div>
    // </main>
  );
}
