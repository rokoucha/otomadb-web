"use client";

import "client-only";

import clsx from "clsx";
import Image from "next/image";
import React, { useMemo, useReducer, useState } from "react";

import { RegisterButton, RegisterData } from "./RegisterButton";
import { RegisterTag } from "./RegisterTag";
import { Semitag } from "./Semitag";
import { TagAdder } from "./TagAdder";

export type SourceData = {
  id: string;
  title: string;
  tags: string[];
  thumbnails: {
    type: string;
    url: string;
  }[];
};

export const RegisterForm: React.FC<{
  className?: string;

  sourceId: string;
  title: string;
  thumbnailUrl: string;
  tags: string[];
  selectTag(id: string): void;
  deselectTag(id: string): void;

  onRegistered(): void;
}> = ({
  className,
  sourceId,
  title: initTitle,
  thumbnailUrl,
  tags: selectedTags,
  deselectTag,
  selectTag,
  onRegistered,
}) => {
  const nicovideoId = useMemo(() => sourceId, [sourceId]);
  const [title, setTitle] = useState(initTitle);

  const [semitagNames, updateSemitagNames] = useReducer(
    (
      state: string[],
      action: { type: "add"; name: string } | { type: "remove"; name: string }
    ) => {
      switch (action.type) {
        case "add":
          if (state.includes(action.name)) return state;
          return [...state, action.name];
        case "remove":
          return state.filter((n) => n !== action.name);
      }
    },
    []
  );

  const registerData = useMemo<RegisterData | undefined>(() => {
    if (typeof nicovideoId === "undefined") return;
    if (typeof title === "undefined") return;
    if (typeof thumbnailUrl === "undefined") return;

    return {
      nicovideoId,
      title,
      tagIds: selectedTags,
      thumbnail: thumbnailUrl,
      semitagNames,
    } satisfies RegisterData;
  }, [nicovideoId, selectedTags, thumbnailUrl, title, semitagNames]);

  return (
    <div className={clsx(className, ["flex", ["flex-col"]], ["gap-y-4"])}>
      <div>
        <p>動画ID</p>
        <p className={clsx(["mt-1"], ["w-full"], ["text-sm"], ["font-bold"])}>
          {nicovideoId}
        </p>
      </div>
      <div>
        <p>タイトル</p>
        <input
          type={"text"}
          value={title}
          className={clsx(
            ["mt-1"],
            ["px-2"],
            ["py-1"],
            ["w-full"],
            ["text-sm"],
            ["font-bold"],
            ["bg-gray-50"],
            ["border", "border-gray-300"],
            ["rounded"]
          )}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        ></input>
      </div>
      <div>
        <p>サムネイル</p>
        <div className={clsx(["mt-1"])}>
          <Image
            className={clsx(["object-scale-down"], ["h-32"])}
            src={thumbnailUrl}
            width={260}
            height={200}
            alt={`${title}のサムネイル候補`}
          />
        </div>
      </div>
      <div>
        <p>タグ付け</p>
        <div className={clsx(["mt-1"], ["px-2"])}>
          <TagAdder
            className={clsx(["w-72"])}
            select={(p) => {
              if (p.type === "tag") selectTag(p.id);
              else updateSemitagNames({ type: "add", name: p.name });
            }}
          />
          <div className={clsx(["mt-2"])}>
            <p className={clsx(["text-sm"])}>タグ</p>
            <div className={clsx(["mt-1"])}>
              {selectedTags.length === 0 && (
                <p className={clsx(["text-slate-500"], ["text-xs"])}>
                  タグ付けはありません
                </p>
              )}
              <div
                className={clsx(
                  ["flex"],
                  ["flex-wrap"],
                  ["gap-x-2"],
                  ["gap-y-2"]
                )}
              >
                {selectedTags.map((id) => (
                  <RegisterTag
                    key={id}
                    id={id}
                    deselect={() => deselectTag(id)}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className={clsx(["mt-2"])}>
            <p className={clsx(["text-sm"])}>仮タグ</p>
            <div className={clsx(["mt-1"])}>
              {semitagNames.length === 0 && (
                <p className={clsx(["text-slate-500"], ["text-xs"])}>
                  仮タグ付けはありません
                </p>
              )}
              <div
                className={clsx(
                  ["flex"],
                  ["flex-wrap"],
                  ["gap-x-2"],
                  ["gap-y-2"]
                )}
              >
                {semitagNames.map((name) => (
                  <Semitag
                    key={name}
                    name={name}
                    className={clsx()}
                    onClick={() => updateSemitagNames({ type: "remove", name })}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <RegisterButton
          registerData={registerData}
          onSuccess={() => {
            onRegistered();
          }}
        />
      </div>
    </div>
  );
};
