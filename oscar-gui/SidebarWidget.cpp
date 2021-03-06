#include "SidebarWidget.h"

#include <QTabWidget>
#include <QHBoxLayout>

#include "SearchInputWidget.h"
#include "GeometryInputWidget.h"
#include "VisualizationOptionsWidget.h"
#include "SearchResultsWidget.h"
#include "ItemDetailsWidget.h"

namespace oscar_gui {

SidebarWidget::SidebarWidget(const States & states) :
m_tabs(new QTabWidget()),
m_si(new SearchInputWidget(states)),
m_sr(new SearchResultsWidget(states)),
m_id(new ItemDetailsWidget(states)),
m_gi(new GeometryInputWidget(states)),
m_vo(new VisualizationOptionsWidget(states))
{
	QHBoxLayout * mainLayout = new QHBoxLayout();
	mainLayout->addWidget(m_tabs);
	m_tabs->addTab(m_si, "Search");
	m_tabs->addTab(m_sr, "Results");
	m_tabs->addTab(m_id, "Details");
	m_tabs->addTab(m_gi, "Geometry");
	m_tabs->addTab(m_vo, "Options");
	this->setLayout(mainLayout);
}


SidebarWidget::~SidebarWidget() {}


void SidebarWidget::focus() {
	m_si->focus();
}

} //end namespace oscar_gui
