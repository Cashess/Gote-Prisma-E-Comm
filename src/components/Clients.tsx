import Image from "next/image";
import { clients } from "../constants";
import styles from "../style";

const Clients = () => (
  <section className={`${styles.flexCenter} my-4`}>
    <div className={`${styles.flexCenter} flex-wrap w-full`}>
      {clients.map((client) => (
        <div key={client.id} className={`flex-1 ${styles.flexCenter} sm:min-w-[192px] min-w-[120px] m-5`}>
          <Image src={client.logo} alt="client_logo" className="sm:w-[100px] w-[80px] object-contain" width={192} height={100}/>
        </div>
      ))}
    </div>
  </section>
);

export default Clients;
