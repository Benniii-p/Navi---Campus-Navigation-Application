package com.navi.campus.model

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AcUnit
import androidx.compose.material.icons.filled.AccountBalance
import androidx.compose.material.icons.filled.Apartment
import androidx.compose.material.icons.filled.Inventory2
import androidx.compose.material.icons.filled.LocalFireDepartment
import androidx.compose.material.icons.filled.School
import androidx.compose.ui.graphics.vector.ImageVector

enum class RoomCategory(val label: String) {
    OFFICE("Office"),
    LABORATORY("Laboratory"),
    CLASSROOM("Classroom"),
    SUPPORT("Support"),
    DEPARTMENT("Department"),
    FACULTY("Faculty"),
}

data class Room(
    val id: String,
    val name: String,
    val floor: String,
    val category: RoomCategory,
    val icon: ImageVector,
)

object RoomRepository {
    val rooms = listOf(
        Room("hr-office", "HR Office", "Ground", RoomCategory.OFFICE, Icons.Filled.AccountBalance),
        Room("store-room", "Store Room / Counseling Area", "Ground", RoomCategory.SUPPORT, Icons.Filled.Inventory2),
        Room("hrm-hot-kitchen", "HRM Laboratory Hot Kitchen", "Ground", RoomCategory.LABORATORY, Icons.Filled.LocalFireDepartment),
        Room("hrm-cold-kitchen", "HRM Laboratory Cold Kitchen", "Ground", RoomCategory.LABORATORY, Icons.Filled.AcUnit),
        Room("hotel-bs-charmchino", "Hotel BS Charmchino", "Ground", RoomCategory.DEPARTMENT, Icons.Filled.Apartment),
        Room("hospitality-faculty", "Hospitality Mgmt Faculty Room", "Ground", RoomCategory.FACULTY, Icons.Filled.School),
    )
}
