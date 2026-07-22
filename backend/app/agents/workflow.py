from langgraph.graph import StateGraph, END
from app.models.schemas import SafetyState
from app.agents.nodes import stream_ingestion_agent, risk_correlation_agent, emergency_orchestrator_agent

def create_workflow():
    workflow = StateGraph(SafetyState)
    
    workflow.add_node("ingestion", stream_ingestion_agent)
    workflow.add_node("correlation", risk_correlation_agent)
    workflow.add_node("orchestrator", emergency_orchestrator_agent)
    
    workflow.set_entry_point("ingestion")
    
    # Conditional routing
    def route_from_ingestion(state: SafetyState):
        if state["current_risk_level"] == "PENDING_AI_REVIEW":
            return "correlation"
        elif state["current_risk_level"] == "CRITICAL_RED":
            return "orchestrator"
        return END

    workflow.add_conditional_edges(
        "ingestion",
        route_from_ingestion,
        {
            "correlation": "correlation",
            "orchestrator": "orchestrator",
            END: END
        }
    )
    
    def route_from_correlation(state: SafetyState):
        if state["current_risk_level"] == "CRITICAL_RED":
            return "orchestrator"
        return END
        
    workflow.add_conditional_edges(
        "correlation",
        route_from_correlation,
        {
            "orchestrator": "orchestrator",
            END: END
        }
    )
    
    workflow.add_edge("orchestrator", END)
    
    return workflow.compile()

safety_workflow = create_workflow()
