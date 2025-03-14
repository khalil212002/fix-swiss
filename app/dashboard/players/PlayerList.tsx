import { useContext, useEffect, useState } from "react";
import { updatePlayer, searchPlayer } from "./actions";

export default function PlayerList({
  formData,
  updatePlayersToggle,
  openPlayerSetting,
}: {
  formData?: FormData;
  updatePlayersToggle: boolean;
  openPlayerSetting: Function;
}) {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    searchPlayer(formData ?? null).then((v) => {
      setPlayers(v);
    });
  }, [formData, updatePlayersToggle]);

  return (
    <div className="min-w-4/6">
      {players.length != 0 && (
        <ul className="list  rounded-box bg-secondary max-h-100 overflow-auto">
          <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Players</li>
          {players.map((p) => {
            return (
              <li key={p.id} className="list-row">
                <div>
                  <div>
                    {p.first_name} {p.last_name} ({p.id})
                  </div>
                  <div className="text-xs uppercase font-semibold opacity-60">
                    {p.birth_year}
                  </div>
                </div>

                <div>{p.rating}</div>
                <div>
                  <label className="fieldset-label my-2 me-2  ">
                    <input
                      name="attendant"
                      type="checkbox"
                      className="checkbox checkbox-success"
                      checked={p.attendant}
                      onChange={(e) => {
                        updatePlayer({
                          id: p.id,
                          attendant: !p.attendant,
                        }).then(() => {
                          searchPlayer(formData ?? null).then((v) =>
                            setPlayers(v)
                          );
                        });
                      }}
                    />
                    Attendant
                  </label>
                </div>
                <button
                  className="btn btn-link no-underline"
                  onClick={() => {
                    openPlayerSetting(p);
                  }}
                >
                  edit
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
