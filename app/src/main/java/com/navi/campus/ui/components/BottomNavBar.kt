package com.navi.campus.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import com.navi.campus.ui.theme.NaviAccentGreen
import com.navi.campus.ui.theme.NaviSurface
import com.navi.campus.ui.theme.NaviTextMuted

enum class NaviTab(val label: String, val icon: ImageVector) {
    HOME("Home", Icons.Filled.Home),
    MAP("Map", Icons.Filled.Map),
    SEARCH("Search", Icons.Filled.Search),
    EMERGENCY("Emergency", Icons.Filled.Warning),
}

@Composable
fun BottomNavBar(
    selected: NaviTab,
    onSelect: (NaviTab) -> Unit,
    modifier: Modifier = Modifier,
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .background(NaviSurface)
            .padding(vertical = 10.dp),
        horizontalArrangement = Arrangement.SpaceAround,
    ) {
        NaviTab.entries.forEach { tab ->
            val isSelected = tab == selected
            val tint = if (isSelected) NaviAccentGreen else NaviTextMuted
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.clickable { onSelect(tab) },
            ) {
                Icon(imageVector = tab.icon, contentDescription = tab.label, tint = tint)
                Text(text = tab.label, color = tint, style = MaterialTheme.typography.bodySmall)
            }
        }
    }
}
