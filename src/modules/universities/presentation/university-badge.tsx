import type { UniversityRecord } from "@/src/modules/universities/application/ports/university-repository";

export function UniversityBadge({
  university,
}: {
  readonly university: Pick<UniversityRecord, "logoPath" | "shortName">;
}) {
  if (university.logoPath) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- logos are local files of unknown, owner-supplied dimensions.
      <img className="universityLogo" src={`/${university.logoPath}`} alt="" />
    );
  }

  return (
    <span className="universityMonogram" aria-hidden="true">
      {university.shortName}
    </span>
  );
}
