export interface Item {
  item_data: {
    barcode: string;
    description: string;
    pid: string;
    enumeration_a: string;
    enumeration_b: string;
    enumeration_c: string;
    enumeration_d: string;
    enumeration_e: string;
    enumeration_f: string;
    enumeration_g: string;
    enumeration_h: string;
    chronology_i: string;
    chronology_j: string;
    chronology_k: string;
    chronology_l: string;
    chronology_m: string;
    physical_material_type : {
      value: string;
      desc: string;
    }
  };
  bib_data: {
    title: string;
    author: string;
    mms_id: string;
  };
  holding_data: {
    holding_id: string;
    temp_call_number: string;
  };
  link: string;
}
