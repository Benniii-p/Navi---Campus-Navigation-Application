package com.navi.campus.backend.repository;

import com.navi.campus.R;
import com.navi.campus.backend.model.RoomCategory;
import com.navi.campus.backend.model.RoomItem;

import java.util.Arrays;
import java.util.List;

/**
 * Stand-in data source for room/building data.
 * Swap the body of {@link #getRooms()} for a real API or database call
 * (e.g. Retrofit call, Room DAO query, Firestore fetch) without touching
 * any frontend code, since callers only depend on this method's signature.
 */
public final class RoomRepository {

    private RoomRepository() {
    }

    public static List<RoomItem> getRooms() {
        return Arrays.asList(
                new RoomItem("hr-office", "HR Office", "Ground", RoomCategory.OFFICE, R.drawable.ic_room_office),
                new RoomItem("store-room", "Store Room / Counseling Area", "Ground", RoomCategory.SUPPORT, R.drawable.ic_room_support),
                new RoomItem("hrm-hot-kitchen", "HRM Laboratory Hot Kitchen", "Ground", RoomCategory.LABORATORY, R.drawable.ic_room_lab_hot),
                new RoomItem("hrm-cold-kitchen", "HRM Laboratory Cold Kitchen", "Ground", RoomCategory.LABORATORY, R.drawable.ic_room_lab_cold),
                new RoomItem("hotel-bs-charmchino", "Hotel BS Charmchino", "Ground", RoomCategory.DEPARTMENT, R.drawable.ic_room_department),
                new RoomItem("hospitality-faculty", "Hospitality Mgmt Faculty Room", "Ground", RoomCategory.FACULTY, R.drawable.ic_room_faculty)
        );
    }
}
