package com.navi.campus.backend.model;

public class RoomItem {

    private final String id;
    private final String name;
    private final String floor;
    private final RoomCategory category;
    private final int iconRes;

    public RoomItem(String id, String name, String floor, RoomCategory category, int iconRes) {
        this.id = id;
        this.name = name;
        this.floor = floor;
        this.category = category;
        this.iconRes = iconRes;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getFloor() {
        return floor;
    }

    public RoomCategory getCategory() {
        return category;
    }

    public int getIconRes() {
        return iconRes;
    }
}
