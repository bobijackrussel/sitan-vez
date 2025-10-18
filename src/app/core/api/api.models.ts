export interface KategorijaPodkategorijaRequest {
  kategorijaNaziv: string;
  podkategorijaNaziv: string;
}

export interface KategorijaPodkategorijaResponse {
  id?: number;
  kategorijaNaziv: string;
  podkategorijaNaziv: string;
}

export interface ArtikalFilterDTO {
  boje?: string[];
  dodaci?: string[];
  kategorije?: string[];
  krojacUsername?: string;
  kvalitetiMaterijala?: string[];
  materijali?: string[];
  naStanju?: boolean;
  naziv?: string;
  podkategorije?: string[];
  velicine?: string[];
}

export interface ArtikalRequestDTO {
  bojaNaziv: string;
  kategorije: KategorijaPodkategorijaRequest[];
  kolicina: number;
  krojacUsername: string;
  kvalitetMaterijalaKvalitet: string;
  materijalNaziv: string;
  naziv: string;
  slikaBase64: string;
  velicina: string;
}

export interface ArtikalResponseDTO {
  bojaNaziv: string;
  id: number;
  kategorije: KategorijaPodkategorijaResponse[];
  kolicina: number;
  krojacUsername: string;
  kvalitetMaterijalaKvalitet: string;
  materijalNaziv: string;
  naziv: string;
  slikaUrl: string;
  velicina: string;
}

export interface ArtikalUslugaRequestDTO {
  artikalId: number;
  uslugaNaziv: string;
}

export interface ArtikalUslugaResponseDTO {
  artikalId: number;
  id: number;
  uslugaNaziv: string;
}

export interface ArtikalVarijacijeDTO {
  boje: string[];
  kvalitetiMaterijala: string[];
  materijali: string[];
  velicine: string[];
}

export interface KlijentRegisterDTO {
  adresa: string;
  email: string;
  ime: string;
  korisnickoIme: string;
  lozinka: string;
  prezime: string;
}

export interface KlijentResponseDTO {
  adresa: string;
  email: string;
  ime: string;
  korisnickoIme: string;
  prezime: string;
}

export type ClientSummary = KlijentResponseDTO & { id?: number };

export interface KreacijaRequestDTO {
  klijentId: number;
  slikaBase64: string;
}

export interface KreacijaResponseDTO {
  id: number;
  klijentId: number;
  slikaUrl: string;
}

export interface KrojacDrzavaPonudaRequestDTO {
  drzavaNaziv: string;
  krojacUsername: string;
  ponudaId: number;
}

export interface KrojacDrzavaPonudaResponseDTO {
  drzavaNaziv: string;
  id: number;
  krojacUsername: string;
  ponudaId: number;
}

export interface KrojacDrzavaRequestDTO {
  cijenaPostarine: number;
  drzavaNaziv: string;
  krojacKorisnickoIme: string;
}

export interface KrojacRegisterDTO {
  adresa: string;
  drzavaNaziv: string;
  email: string;
  ime: string;
  korisnickoIme: string;
  lozinka: string;
  opis: string;
  prezime: string;
  usloviPoslovanja: string;
}

export interface KrojacResponseDTO {
  adresa: string;
  drzavaNaziv: string;
  email: string;
  ime: string;
  korisnickoIme: string;
  opis: string;
  prezime: string;
  usloviPoslovanja: string;
}

export interface MjereRequestDTO {
  duzina: number;
  id: number;
  korisnickoIme: string;
  obimBokova: number;
  obimGrudi: number;
  obimKukova: number;
  obimStruka: number;
  sirinaRamena: number;
}

export interface MjereResponseDTO {
  datum: string;
  duzina: number;
  id: number;
  korisnickoIme: string;
  obimBokova: number;
  obimGrudi: number;
  obimKukova: number;
  obimStruka: number;
  sirinaRamena: number;
}

export interface ArtikalDodatakResponse {
  id: number;
  naziv: string;
  opis?: string;
  cijena?: number;
  slikaUrl?: string;
}

export interface NarudzbaDTO {
  datum: string;
  datumOtkazivanja: string;
  id: number;
  klijentId: number;
  krojacId: number;
  rokZaIzradu: string;
  rokZaOtkazivanje: string;
  statusNarudzbeNaziv: string;
  stavke: StavkaNarudzbeDTO[];
  uplacenAvans: number;
}

export interface NarudzbaFilterDTO {
  datum?: string;
  datumOtkazivanja?: string;
  datumZavrsetkaDo?: string;
  datumZavrsetkaOd?: string;
  klijentUsername?: string;
  krojacUsername?: string;
  rokZaIzraduDo?: string;
  rokZaOtkazivanjeDo?: string;
  statusNarudzbe?: string[];
  stavkaFilter?: StavkaNarudzbeFilterDTO;
  uplacenAvans?: number;
}

export interface PonudaArtikalRequestDTO {
  artikal: ArtikalRequestDTO;
  brojDanaZaIzradu: number;
  brojDanaZaOtkazivanje: number;
  jedinicnaCijena: number;
  krojacUsername: string;
  procenatPopusta: number;
  procenatZaHitnost: number;
  uslugaNaziv: string;
}

export interface PonudaArtikalUslugaRequestDTO {
  artikalUsluga: ArtikalUslugaRequestDTO;
  brojDanaZaIzradu: number;
  brojDanaZaOtkazivanje: number;
  jedinicnaCijena: number;
  krojacUsername: string;
  procenatPopusta: number;
  procenatZaHitnost: number;
}

export interface PonudaArtikalUslugaResponseDTO {
  artikal: ArtikalResponseDTO;
  brojDanaZaIzradu: number;
  brojDanaZaOtkazivanje: number;
  id: number;
  jedinicnaCijena: number;
  krojacUsername: string;
  procenatPopusta: number;
  procenatZaHitnost: number;
  uslugaNaziv: string;
}

export interface PonudaFilterDTO {
  artikalFilter?: ArtikalFilterDTO;
  drzave?: string[];
  krojacUsername?: string;
  maxCijena?: number;
  minCijena?: number;
  rokDoIzrade?: string;
  uslugaFilter?: boolean;
  usluge?: string[];
}

export interface PonudaUslugaRequestDTO {
  jedinicnaCijena: number;
  krojacUsername: string;
  procenatPopusta: number;
  procenatZaHitnost: number;
  uslugaNaziv: string;
}

export interface PonudaUslugaResponseDTO {
  id: number;
  jedinicnaCijena: number;
  krojacUsername: string;
  procenatPopusta: number;
  procenatZaHitnost: number;
  uslugaNaziv: string;
}

export interface SablonRequestDTO {
  artikalId: number;
  cijena: number;
  slikaBase64: string;
}

export interface SablonResponseDTO {
  artikalId: number;
  cijena: number;
  id: number;
  slikaUrl: string;
}

export interface StavkaNarudzbeDTO {
  cijena: number;
  datumOtkazivanja: string;
  dodaci: ArtikalDodatakResponse[];
  id: number;
  kolicina: number;
  krojacDrzavaPonuda: KrojacDrzavaPonudaResponseDTO;
  mjereId: number;
  narudzbaId: number;
  ponudaId: number;
  redniBroj: number;
  rokZaIzradu: string;
  rokZaOtkazivanje: string;
  statusStavkeNaziv: string;
  uplacenAvans: number;
}

export interface StavkaNarudzbeFilterDTO {
  cijenaMax?: number;
  cijenaMin?: number;
  dodaci?: string[];
  kolicinaMax?: number;
  kolicinaMin?: number;
  ponudaFilter?: PonudaFilterDTO;
  rokZaIzraduDo?: string;
  statusStavkeNaziv?: string;
}

export type OfferSummary = (PonudaArtikalUslugaResponseDTO | PonudaUslugaResponseDTO) & {
  artikal?: ArtikalResponseDTO;
  brojDanaZaIzradu?: number;
  brojDanaZaOtkazivanje?: number;
};

export interface OfferDetail {
  offer: OfferSummary;
  article?: ArtikalResponseDTO;
  services?: PonudaUslugaResponseDTO[];
  addons?: ArtikalDodatakResponse[];
  availableCountries?: string[];
}

export interface MeasurementSnapshot extends MjereResponseDTO {}

export interface OrderSummary extends NarudzbaDTO {}

export interface OrderItemSummary extends StavkaNarudzbeDTO {}

export interface Creation extends KreacijaResponseDTO {}


export interface UsernameRequest {
  korisnickoIme: string;
}



export interface DictionaryEntity {
  id?: number;
  naziv?: string;
  oznaka?: string;
  opis?: string;
  [key: string]: unknown;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
