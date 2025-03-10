import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CopyOutlined,
  EditOutlined,
  EllipsisOutlined,
  PlusCircleOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import { Button, Dropdown } from "antd";
import cx from "clsx";
import React from "react";
import SectionViewer from "web/components/SectionViewer";
import { Section } from "web/typing/common";
import styles from "../index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: Section;
  onActivateEditor?: () => void;
  onChange?: (section: Section) => void;
  onDelete?: () => void;
  onMove?: (destination: "up" | "down" | "top" | "bottom") => void;
  onInsert?: (destination: "above" | "below") => void;
  onDuplicate?: () => void;
};

export default function Viewer({
  className,
  style,
  value,
  onActivateEditor,
  onChange,
  onDelete,
  onMove,
  onInsert,
  onDuplicate,
}: Props) {
  return (
    <div className={cx(styles.Viewer, className)} style={style}>
      <div className={styles.content}>
        <SectionViewer section={value} />
      </div>
      <div className={styles.menuContainer}>
        <div className={styles.menu}>
          <Button
            icon={<EditOutlined />}
            onClick={() => onActivateEditor?.()}
          />
          <Dropdown
            menu={{
              items: [
                {
                  key: "insert-above",
                  label: "Insert Above",
                  icon: <PlusCircleOutlined rotate={180} />,
                  onClick: () => onInsert?.("above"),
                },
                {
                  key: "insert-below",
                  label: "Insert Below",
                  icon: <PlusCircleOutlined />,
                  onClick: () => onInsert?.("below"),
                },
                {
                  key: "duplicate",
                  label: "Duplicate",
                  icon: <CopyOutlined />,
                  onClick: () => onDuplicate?.(),
                },
                {
                  type: "divider",
                },
                {
                  key: "move-top",
                  label: "Move to Top",
                  icon: <VerticalAlignTopOutlined />,
                  onClick: () => onMove?.("top"),
                },
                {
                  key: "move-up",
                  label: "Move Up",
                  icon: <ArrowUpOutlined />,
                  onClick: () => onMove?.("up"),
                },
                {
                  key: "move-down",
                  label: "Move Down",
                  icon: <ArrowDownOutlined />,
                  onClick: () => onMove?.("down"),
                },
                {
                  key: "move-bottom",
                  label: "Move to Bottom",
                  icon: <VerticalAlignBottomOutlined />,
                  onClick: () => onMove?.("bottom"),
                },
                {
                  type: "divider",
                },
                {
                  key: "clear",
                  label: "Clear",
                  onClick: () =>
                    onChange?.({ key: Date.now(), union: { type: "NONE" } }),
                },
                {
                  key: "delete",
                  label: "Delete",
                  danger: true,
                  onClick: () => onDelete?.(),
                },
              ],
            }}
            trigger={["click"]}
          >
            <Button icon={<EllipsisOutlined />} />
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
