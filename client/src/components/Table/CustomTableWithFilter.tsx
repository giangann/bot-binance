import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { UnknownObj } from "../../shared/types/base";
import { CustomTable, StrictField } from "./Customtable";
import { FilterBar } from "./FilterBar";
import { getApi } from "../../request/request";

type CustomTableWithFilterProps<TData extends UnknownObj> = {
  apiEndPoint: string;
  fields: StrictField<TData>[];
  createRoute?: string;
  onViewDetail?: (row: TData) => void;
};

const defaultParams = {};
export const CustomTableWithFilter = <TData extends UnknownObj>({
  fields,
  apiEndPoint,
  createRoute,
  onViewDetail
}: CustomTableWithFilterProps<TData>) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<TData[]>([]);
  const { ...useFormReturns } = useForm();
  const { handleSubmit, reset } = useFormReturns;

  function editPrams() {
    let params = {};
    searchParams.forEach((value, key) => {
      //   @ts-ignore
      params[key] = value;
    });
    return params;
  }
  const params = useMemo(() => editPrams(), [searchParams]);

  const onResetParams = () => {
    setSearchParams(defaultParams);
    reset();
  };

  // ----------------------------------------------------------------------------
  // ----------------------------------------------------------------------------
  useEffect(() => {
    async function fetchData() {
      const res = await getApi<TData[]>(apiEndPoint, params);
      if (res.success) {
        setData(res.data);
      }
    }
    fetchData();
  }, [searchParams]);
  // ----------------------------------------------------------------------------

  return (
    <>
      <form onSubmit={handleSubmit((params) => setSearchParams(params))}>
        <FilterBar
          {...useFormReturns}
          fields={fields}
          onResetParams={onResetParams}
          createRoute={createRoute}
        />
      </form>
      <CustomTable fields={fields} data={data} onActionViewDetail={onViewDetail} />
    </>
  );
};
