package com.navi.campus.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.navi.campus.model.RoomCategory
import com.navi.campus.ui.theme.BadgeDeptBg
import com.navi.campus.ui.theme.BadgeDeptText
import com.navi.campus.ui.theme.BadgeFacultyBg
import com.navi.campus.ui.theme.BadgeFacultyText
import com.navi.campus.ui.theme.BadgeLabBg
import com.navi.campus.ui.theme.BadgeLabText
import com.navi.campus.ui.theme.BadgeOfficeBg
import com.navi.campus.ui.theme.BadgeOfficeText
import com.navi.campus.ui.theme.BadgeSupportBg
import com.navi.campus.ui.theme.BadgeSupportText

private fun colorsFor(category: RoomCategory): Pair<Color, Color> = when (category) {
    RoomCategory.OFFICE -> BadgeOfficeBg to BadgeOfficeText
    RoomCategory.SUPPORT -> BadgeSupportBg to BadgeSupportText
    RoomCategory.LABORATORY -> BadgeLabBg to BadgeLabText
    RoomCategory.DEPARTMENT -> BadgeDeptBg to BadgeDeptText
    RoomCategory.CLASSROOM -> BadgeDeptBg to BadgeDeptText
    RoomCategory.FACULTY -> BadgeFacultyBg to BadgeFacultyText
}

@Composable
fun CategoryBadge(category: RoomCategory, modifier: Modifier = Modifier) {
    val (background, textColor) = colorsFor(category)
    Text(
        text = category.label,
        color = textColor,
        style = MaterialTheme.typography.labelSmall,
        modifier = modifier
            .background(background, RoundedCornerShape(6.dp))
            .padding(horizontal = 8.dp, vertical = 4.dp),
    )
}
