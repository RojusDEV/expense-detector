import { capitalize, colors } from "@/lib/utils";
import { getMerchantList } from "@/shared/api/merchantApi";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

const MerchantsPage = () => {
  const {
    isLoading,
    isError,
    data: merchants,
  } = useQuery({
    queryKey: ["merchants"],
    queryFn: getMerchantList,
  });

  return (
    <div>
      <div className="max-w-full bg-(--bg-primary-dashboard) px-8 py-7">
        <h1 className="font-playfair text-2xl leading-[120%] font-medium text-(--text-primary-white)">
          Prekybininkai
        </h1>
        <h2 className="mt-2 mb-5 font-normal text-(--text-gray-400)">
          {merchants?.length} prekybininkai
        </h2>
        <div className="">
          <ul className="rounded-lg border border-(--content-outline) bg-(--card-background) p-5">
            {merchants &&
              merchants.map((merchant) => (
                <li className="mb-8" key={merchant.id}>
                  <div className="font-outfit">
                    <span className="text-md font-semibold">
                      {capitalize(merchant.merchantName)}{" "}
                    </span>
                    <span
                      className={`${colors[merchant.categoryName]} bg-transparent! text-sm`}
                    >
                      {capitalize(merchant.categoryName)}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {merchant.merchantAliases != undefined &&
                      merchant.merchantAliases.slice(0, 5).map((alias) => (
                        <div className="font-brains rounded-sm border border-(--content-outline) bg-(--input-bg-black) px-2 py-1 text-sm">
                          <span className="text-(--label-gray-300)">
                            {alias}
                          </span>
                        </div>
                      ))}
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MerchantsPage;
