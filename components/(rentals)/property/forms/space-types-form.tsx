import { Button } from "@/ui/Button";
import React from "react";
import { Text, View } from "react-native";
import { Theme } from "@/constants";
import Feather from "@expo/vector-icons/Feather";
import { useBottomSheetImperative } from "@/components/shared/BottomSheetModal";
import RoomInputForm from "@/components/(rentals)/RoomInputForm";
import RoomDisplay from "@/components/(rentals)/RoomDisplay";
import { ScrollView } from "react-native-gesture-handler";
import { Accordion, AccordionItem } from "@/ui/Accordion";
import { uuid } from "expo-modules-core";

export interface SpaceType {
  name: string;
  rent_per_month: number;
  id: string;
  parent: string;
  is_deleted?: boolean;
}
interface Props {
  rooms: Array<SpaceType>;
  partitions: Array<SpaceType>;
  beds: Array<SpaceType>;
  setRooms: React.Dispatch<React.SetStateAction<Array<SpaceType>>>;
  setPartitions: React.Dispatch<React.SetStateAction<Array<SpaceType>>>;
  setBeds: React.Dispatch<React.SetStateAction<Array<SpaceType>>>;
}
const SpaceTypesForm = ({
  beds,
  partitions,
  rooms,
  setBeds,
  setPartitions,
  setRooms,
}: Props) => {
  const allSpaces = rooms
    .filter((room) => !room.is_deleted)
    .map((room) => {
      const room_partitions = partitions
        .filter((p) => p.parent === room.id && !p.is_deleted)
        .map((partition) => {
          const partitions_bed = beds
            .filter((bed) => bed.parent === partition.id && !bed.is_deleted)
            .map((bed) => bed);
          return {
            ...partition,
            beds: partitions_bed,
          };
        });
      return {
        ...room,
        partitions: room_partitions,
      };
    });

  const addRoomModal = useBottomSheetImperative({
    content: (onClose) => {
      return (
        <View className="px-4 gap-2 flex-1">
          <RoomInputForm
            type={"room"}
            onSave={(values) => {
              setRooms((rooms) => [
                ...rooms,
                {
                  id: "new_room_" + uuid.v4(),
                  name: values.name,
                  rent_per_month: values.rent_per_month,
                  parent: "null",
                },
              ]);
              onClose();
            }}
          />
        </View>
      );
    },
    trigger: (onOpen) => {
      return (
        <Button
          variant={"default"}
          className="items-center justify-center bg-blue-100 rounded-md gap-2 px-6 py-3 h-auto self-center"
          onPress={() => onOpen()}
        >
          <Feather name="plus" size={20} color={`${Theme.blue[600]}`} />
          <Text className="text-lg text-blue-600 text-center font-semibold">
            Add Room
          </Text>
        </Button>
      );
    },
  });

  return (
    <ScrollView
      className="relative flex-1"
      style={{ marginBottom: 80, marginTop: 0 }}
    >
      {allSpaces?.map((room, room_idx) => (
        <Accordion key={room_idx} className="pl-4">
          <RoomDisplay
            name={room.name}
            subType={"partition"}
            rent_per_month={room.rent_per_month}
            type={"room"}
            parent_crumbs={[]}
            has_children={room.partitions.length > 0}
            subActionTitle={"Add Partition"}
            onSubAction={(values) => {
              setPartitions((partitions) => [
                ...partitions,
                {
                  id: "new_partition_" + uuid.v4(),
                  name: values.name,
                  rent_per_month: values.rent_per_month,
                  parent: room.id,
                },
              ]);
            }}
            onDelete={() => {
              const roomToDelete = room;
              setRooms((rooms) => {
                if (roomToDelete.id.startsWith("new_")) {
                  // Deleting new rooms
                  return rooms.filter((r) => r.id !== roomToDelete.id);
                } else {
                  // Deleting persisted rooms
                  return rooms.map((r) => {
                    if (r.id === roomToDelete.id) {
                      return {
                        ...r,
                        is_deleted: true,
                      };
                    }
                    return r;
                  });
                }
              });
              setPartitions((partitions) => {
                const partitionsToDelete = roomToDelete.partitions.map((p) => p.id);
                return partitions
                  .filter((p) => {
                    return (
                      !(p.id.startsWith("new_") && partitionsToDelete.includes(p.id))
                      
                    );
                  })
                  .map((p) => {
                    if (partitionsToDelete.includes(p.id)) {
                      return {
                        ...p,
                        is_deleted: true,
                      };
                    }
                    return p;
                  });
              });
              setBeds((beds) => {
                const idsToDelete = roomToDelete.partitions.flatMap((p) =>
                  p.beds.map((b) => b.id)
                );
                return beds
                  .filter((b) => {
                    return (
                      !(idsToDelete.includes(b.id) && b.id.startsWith("new_"))
                    );
                  })
                  .map((b) => {
                    if (idsToDelete.includes(b.id)) {
                      return {
                        ...b,
                        is_deleted: true,
                      };
                    }
                    return b;
                  });
              });
            }}
            onUpdate={(values) => {
              setRooms((rooms) =>
                rooms.map((r) =>
                  r.id === room.id
                    ? {
                        ...r,
                        ...values,
                      }
                    : r
                )
              );
            }}
          />
          <AccordionItem
            style={{ marginLeft: 36, width: "100%", paddingRight: 40 }}
          >
            {room.partitions.map((partition, partitionIdx) => (
              <Accordion key={partitionIdx}>
                <RoomDisplay
                  name={partition.name}
                  rent_per_month={partition.rent_per_month}
                  type={"partition"}
                  subType={"bed"}
                  parent_crumbs={[room.name]}
                  has_children={partition.beds.length > 0}
                  subActionTitle={"Add Bed"}
                  onSubAction={(values) => {
                    setBeds((beds) => [
                      ...beds,
                      {
                        id: "new_bed_" + uuid.v4(),
                        name: values.name,
                        parent: partition.id,
                        rent_per_month: values.rent_per_month,
                      },
                    ]);
                  }}
                  onDelete={() => {
                    const partitionToDelete = partition;
                    setPartitions((partitions) => {
                      if (partitionToDelete.id.startsWith("new_")) {
                        return partitions.filter(
                          (p) => p.id !== partitionToDelete.id
                        );
                      }
                      return partitions.map((p) => {
                        if (p.id === partitionToDelete.id) {
                          return {
                            ...p,
                            is_deleted: true,
                          };
                        }
                        return p;
                      });
                    });
                    setBeds((beds) => {
                      const bedsToDelete = partitionToDelete.beds.map(
                        (b) => b.id
                      );
                      return beds
                        .filter(
                          (b) =>
                            ! (bedsToDelete.includes(b.id) && b.id.startsWith("new_"))
                        )
                        .map((b) => {
                          if (b.parent === partitionToDelete.id) {
                            return {
                              ...b,
                              is_deleted: true,
                            };
                          }
                          return b;
                        });
                    });
                  }}
                  onUpdate={(values) => {
                    setPartitions((p) =>
                      p.map((b) => {
                        if (b.id === partition.id) {
                          return {
                            ...b,
                            ...values,
                          };
                        }
                        return b;
                      })
                    );
                  }}
                />
                <AccordionItem style={{ marginLeft: 40, paddingLeft: 24 }}>
                  {partition.beds.map((bed, idx) => (
                    <RoomDisplay
                      key={idx}
                      name={bed.name}
                      rent_per_month={bed.rent_per_month}
                      type={"bed"}
                      parent_crumbs={[room.name, partition.name]}
                      has_children={false}
                      onDelete={() => {
                        setBeds((beds) => {
                          const bedToDelete = bed;
                          if (bedToDelete.id.startsWith("new_")) {
                            return beds.filter((b) => b.id !== bedToDelete.id);
                          } else {
                            return beds.map((b) => {
                              if (b.id === bedToDelete.id) {
                                return {
                                  ...b,
                                  is_deleted: true,
                                };
                              }
                              return b;
                            });
                          }
                        });
                      }}
                      onUpdate={(values) => {
                        setBeds((b) =>
                          b.map((b) => {
                            if (b.id === bed.id) {
                              return {
                                ...b,
                                ...values,
                              };
                            }
                            return b;
                          })
                        );
                      }}
                    />
                  ))}
                </AccordionItem>
              </Accordion>
            ))}
          </AccordionItem>
        </Accordion>
      ))}
      <View className="justify-center px-4 mt-8 mb-8">{addRoomModal}</View>
    </ScrollView>
  );
};

export default SpaceTypesForm;
